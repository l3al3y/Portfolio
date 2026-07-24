document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const btnEdit = document.getElementById('btn-edit');
    const btnCopy = document.getElementById('btn-copy');
    const btnPrint = document.getElementById('btn-print');
    
    const editModal = document.getElementById('edit-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnSaveContact = document.getElementById('btn-save-contact');

    // Display fields
    const dispName = document.getElementById('disp-name');
    const dispLocation = document.getElementById('disp-location');
    const dispPhone = document.getElementById('disp-phone');
    const dispEmail = document.getElementById('disp-email');
    const dispLinkedin = document.getElementById('disp-linkedin');
    const dispGithub = document.getElementById('disp-github');
    const dispPortfolio = document.getElementById('disp-portfolio');

    // Input fields
    const inputName = document.getElementById('input-name');
    const inputLocation = document.getElementById('input-location');
    const inputPhone = document.getElementById('input-phone');
    const inputEmail = document.getElementById('input-email');
    const inputLinkedin = document.getElementById('input-linkedin');
    const inputGithub = document.getElementById('input-github');
    const inputPortfolio = document.getElementById('input-portfolio');

    // Modal controls
    btnEdit.addEventListener('click', () => {
        editModal.classList.remove('hidden');
    });

    btnCloseModal.addEventListener('click', () => {
        editModal.classList.add('hidden');
    });

    btnSaveContact.addEventListener('click', () => {
        dispName.textContent = inputName.value.trim() || 'MUHAMMAD IRFAN FAHMI BIN SAMSUL KAMAR';
        dispLocation.textContent = inputLocation.value.trim() || 'Melaka, Malaysia';
        dispPhone.textContent = inputPhone.value.trim() || '+60 11-XXXX XXXX';
        dispEmail.textContent = inputEmail.value.trim() || 'fahmilatif87@gmail.com';
        dispLinkedin.textContent = inputLinkedin.value.trim() || 'linkedin.com/in/mifi99';
        dispGithub.textContent = inputGithub.value.trim() || 'github.com/l3al3y';
        dispPortfolio.textContent = inputPortfolio.value.trim() || 'irfanfahmi.dev';

        editModal.classList.add('hidden');
    });

    // Print to PDF
    btnPrint.addEventListener('click', () => {
        window.print();
    });

    // Copy ATS Plain Text
    btnCopy.addEventListener('click', () => {
        const resumeElement = document.getElementById('resume-content');
        const textContent = resumeElement.innerText;

        navigator.clipboard.writeText(textContent).then(() => {
            const originalText = btnCopy.textContent;
            btnCopy.textContent = '✅ Copied to Clipboard!';
            setTimeout(() => {
                btnCopy.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy text. Please manually select and copy.');
        });
    });
});
