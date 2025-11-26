/* scripts.js
   Interactions JS : menu mobile, ouverture du formulaire vers WhatsApp,
   validation minimale, changement année dans le footer.
*/

// ---- Configuration utilisateur ----
// Numéro WhatsApp de l'Hôtel Le Terminal
const WHATSAPP_NUMBER = "22870115820";

// ---- Utilitaires ----
function encodeMessage(msg){
  return encodeURIComponent(msg);
}

// ---- DOM Ready ----
document.addEventListener('DOMContentLoaded', function(){

  // header year
  document.getElementById('year').textContent = new Date().getFullYear();

  // mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  navToggle && navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    navToggle.classList.toggle('open');
  });

  // Fermer le menu quand on clique sur un lien
  const navLinks = mainNav ? mainNav.querySelectorAll('a') : [];
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
    });
  });

  // buttons "Réserver" sur les cartes -> pré-remplit le choix de chambre
  document.querySelectorAll('.open-book').forEach(btn => {
    btn.addEventListener('click', () => {
      const room = btn.dataset.room || '';
      document.getElementById('guest-room').value = room;
      // Scroll vers le formulaire
      document.getElementById('contact').scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // buttons "Réserver/Commander" sur les services -> envoie direct WhatsApp
  document.querySelectorAll('.book-service').forEach(btn => {
    btn.addEventListener('click', () => {
      const service = btn.dataset.service || '';
      const message = encodeMessage(`Bonjour, je suis intéressé(e) par : ${service}\nVeuillez me contacter pour plus d'informations.`);
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
      window.open(url, '_blank');
    });
  });

  // Envoi du formulaire via WhatsApp
  const sendBtn = document.getElementById('send-whatsapp');
  sendBtn && sendBtn.addEventListener('click', function(){
    // Collecte des données
    const name = document.getElementById('guest-name').value.trim();
    const phone = document.getElementById('guest-phone').value.trim();
    const room = document.getElementById('guest-room').value;
    const checkin = document.getElementById('guest-checkin').value;
    const checkout = document.getElementById('guest-checkout').value;
    const msg = document.getElementById('guest-msg').value.trim();

    // Validation simple
    if(!name || !phone || !checkin || !checkout){
      alert('Veuillez remplir au minimum : nom, téléphone, date d\'arrivée et date de départ.');
      return;
    }

    // Construire le message
    let message = `Bonjour, je souhaite réserver une chambre.%0A`;
    message += `Nom: ${name}%0A`;
    message += `Téléphone (WhatsApp): ${phone}%0A`;
    message += `Chambre: ${room}%0A`;
    message += `Arrivée: ${checkin}%0A`;
    message += `Départ: ${checkout}%0A`;
    if(msg) message += `Remarques: ${msg}%0A`;

    // Si WHATSAPP_NUMBER n'est pas remplacé, ouvrir un wa.me générique (ceci provoquera une erreur si absent)
    const waNumber = WHATSAPP_NUMBER && WHATSAPP_NUMBER !== '22870115820' ? WHATSAPP_NUMBER : phone.replace(/\D/g,'');

    const url = `https://wa.me/${waNumber}?text=${message}`;
    window.open(url, '_blank');
  });

  // clear form
  const clearBtn = document.getElementById('clear-form');
  clearBtn && clearBtn.addEventListener('click', () => {
    document.getElementById('booking-form').reset();
  });

  // quick book button in hero (if user hasn't replaced PHONE_NUMBER it opens new tab with placeholder)
  const quickBook = document.getElementById('quick-book');
  if(quickBook){
    const href = quickBook.getAttribute('href');
    if(href.includes('PHONE_NUMBER') && WHATSAPP_NUMBER !== '22870115820'){
      quickBook.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeMessage('Bonjour - Je souhaite réserver une chambre')}`);
    }
  }

});
