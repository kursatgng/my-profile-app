document.getElementById('profileForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    fetch('/profile', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
        } else {
            alert('Bir hata oluştu.');
        }
        // Formu temizle
        this.reset();
        // Profilleri güncelle
        fetchProfiles();
    })
    .catch(error => console.error('Hata:', error));
});

function fetchProfiles() {
    fetch('/profiles')
        .then(response => response.json())
        .then(data => {
            const profilesList = document.getElementById('profilesList');
            profilesList.innerHTML = ''; // Mevcut içerikleri temizle
            data.forEach(user => {
                const listItem = document.createElement('li');
                listItem.textContent = `${user.username} - ${user.email} - ${user.phone}`;
                profilesList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Profil bilgileri alınamadı:', error));
}

// Sayfa yüklendiğinde profilleri getir
document.addEventListener('DOMContentLoaded', function() {
    fetchProfiles();
});
