/**
 * Contact Verification & Turnstile CAPTCHA Gate Worker
 * Candidate: MUHAMMAD IRFAN FAHMI BIN SAMSUL KAMAR
 * 
 * Cloudflare Worker edge function for validating Turnstile tokens and returning
 * protected candidate contact details to human recruiters.
 */

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
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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

        // 2. Handle POST Request for Turnstile CAPTCHA Verification
        if (request.method === "POST") {
            try {
                const body = await request.json().catch(() => ({}));
                const turnstileToken = body.turnstileToken || body.token;
                const clientIp = request.headers.get("CF-Connecting-IP") || "";

                if (!turnstileToken) {
                    return new Response(JSON.stringify({ error: "verification failed", reason: "missing_token" }), {
                        headers: corsHeaders,
                        status: 403
                    });
                }

                const secret = env.TURNSTILE_SECRET;
                if (!secret) {
                    return new Response(JSON.stringify({ error: "verification failed", reason: "missing_secret_config" }), {
                        headers: corsHeaders,
                        status: 500
                    });
                }

                // Call Cloudflare Turnstile siteverify API
                const formData = new FormData();
                formData.append("secret", secret);
                formData.append("response", turnstileToken);
                if (clientIp) formData.append("remoteip", clientIp);

                const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
                    method: "POST",
                    body: formData
                });

                const result = await verifyRes.json().catch(() => ({ success: false }));

                if (result.success === true) {
                    return new Response(JSON.stringify({
                        email: env.CONTACT_EMAIL || "fahmilatif87@gmail.com",
                        phone: env.CONTACT_PHONE || "+60 16-243 2023"
                    }), {
                        headers: corsHeaders,
                        status: 200
                    });
                } else {
                    return new Response(JSON.stringify({ error: "verification failed" }), {
                        headers: corsHeaders,
                        status: 403
                    });
                }
            } catch (err) {
                return new Response(JSON.stringify({ error: "verification failed" }), {
                    headers: corsHeaders,
                    status: 403
                });
            }
        }

        // 3. Handle GET Requests (Health Check)
        if (request.method === "GET") {
            return new Response(JSON.stringify({
                status: "healthy",
                service: "contact-gate-worker"
            }), {
                headers: corsHeaders,
                status: 200
            });
        }

        // 4. Default Fallback
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            headers: corsHeaders,
            status: 405
        });
    }
};
