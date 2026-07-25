/**
 * Contact Verification & Turnstile CAPTCHA Gate Worker
 * Candidate: MUHAMMAD IRFAN FAHMI BIN SAMSUL KAMAR
 * 
 * Verifies Turnstile tokens against Cloudflare Siteverify API before
 * securely returning candidate direct contact details to human recruiters.
 */

const DEFAULT_EMAIL = "fahmilatif87@gmail.com";
const DEFAULT_PHONE = "+60 16-243 2023";
const DEFAULT_WHATSAPP = "https://wa.me/60162432023";

// Allowed origins for CORS protection
const ALLOWED_ORIGINS = [
    "https://l3al3y.github.io",
    "http://localhost:8000",
    "http://127.0.0.1:8000"
];

function getCorsHeaders(request) {
    const origin = request.headers.get("Origin") || "";
    const isAllowed = ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed)) || origin.includes("github.io") || origin.includes("localhost");

    return {
        "Access-Control-Allow-Origin": isAllowed ? origin : "https://l3al3y.github.io",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
        "Content-Type": "application/json"
    };
}

export default {
    async fetch(request, env, ctx) {
        const corsHeaders = getCorsHeaders(request);

        // 1. Handle CORS Preflight OPTIONS Request
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders, status: 204 });
        }

        const url = new URL(request.url);

        // 2. Health check route
        if (url.pathname === "/health" || url.pathname === "/") {
            return new Response(JSON.stringify({
                status: "healthy",
                service: "contact-gate-worker",
                timestamp: new Date().toISOString()
            }), {
                headers: corsHeaders,
                status: 200
            });
        }

        // 3. Contact Verification Endpoint
        if (request.method === "POST" && url.pathname === "/api/verify-captcha") {
            try {
                const body = await request.json().catch(() => ({}));
                const token = body.token;
                const userIp = request.headers.get("CF-Connecting-IP") || "";

                if (!token) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: "MISSING_TOKEN",
                        message: "Turnstile CAPTCHA token is required."
                    }), { headers: corsHeaders, status: 400 });
                }

                // 4. Verify Turnstile token with Cloudflare API
                const turnstileSecret = env.TURNSTILE_SECRET;
                if (!turnstileSecret) {
                    console.error("TURNSTILE_SECRET environment variable is missing.");
                    return new Response(JSON.stringify({
                        success: false,
                        error: "SERVER_CONFIG_ERROR",
                        message: "Server configuration missing secret key."
                    }), { headers: corsHeaders, status: 500 });
                }

                const formData = new FormData();
                formData.append("secret", turnstileSecret);
                formData.append("response", token);
                if (userIp) formData.append("remoteip", userIp);

                const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
                    method: "POST",
                    body: formData
                });

                const verifyData = await verifyRes.json();

                if (!verifyData.success) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: "CAPTCHA_VERIFICATION_FAILED",
                        message: "Turnstile verification failed. Please try again.",
                        details: verifyData["error-codes"] || []
                    }), { headers: corsHeaders, status: 403 });
                }

                // 5. Verification Successful - Return Encrypted/Protected Candidate Details
                const email = env.CONTACT_EMAIL || DEFAULT_EMAIL;
                const phone = env.CONTACT_PHONE || DEFAULT_PHONE;
                const whatsapp = env.CONTACT_WHATSAPP || DEFAULT_WHATSAPP;

                return new Response(JSON.stringify({
                    success: true,
                    verified: true,
                    timestamp: new Date().toISOString(),
                    contact: {
                        email: email,
                        phone: phone,
                        whatsapp: whatsapp
                    }
                }), { headers: corsHeaders, status: 200 });

            } catch (err) {
                return new Response(JSON.stringify({
                    success: false,
                    error: "INTERNAL_ERROR",
                    message: err.message || "An unexpected error occurred."
                }), { headers: corsHeaders, status: 500 });
            }
        }

        // 404 Route Not Found
        return new Response(JSON.stringify({
            success: false,
            error: "NOT_FOUND",
            message: "Endpoint not found."
        }), { headers: corsHeaders, status: 404 });
    }
};
