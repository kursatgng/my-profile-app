document.getElementById('profileForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('username', document.getElementById('username').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('phone', document.getElementById('phone').value);
    formData.append('birthdate', document.getElementById('birthdate').value);
    formData.append('profilePicture', document.getElementById('profilePicture').files[0]);
    formData.append('linkedin', document.getElementById('linkedin').value);
    formData.append('twitter', document.getElementById('twitter').value);
    formData.append('github', document.getElementById('github').value);

    try {
        const response = await fetch('http://localhost:3001/profile', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Profil başarıyla kaydedildi.');
            loadProfiles(); // Kaydedilen profilleri güncelle
        } else {
            alert('Profil kaydedilemedi.');
        }
    } catch (error) {
        console.error('Profil kaydedilirken hata oluştu:', error);
        alert('Profil kaydedilirken hata oluştu.');
    }
});

async function loadProfiles() {
    try {
        const response = await fetch('http://localhost:3001/profiles');
        const profiles = await response.json();

        const profilesContainer = document.getElementById('profiles');
        profilesContainer.innerHTML = ''; // Önceki profilleri temizle

        profiles.forEach(profile => {
            const profileElement = document.createElement('div');
            profileElement.innerHTML = `
                <p><strong>Kullanıcı Adı:</strong> ${profile.username}</p>
                <p><strong>E-posta:</strong> ${profile.email}</p>
                <p><strong>Telefon:</strong> ${profile.phone}</p>
                <p><strong>Doğum Tarihi:</strong> ${new Date(profile.birthdate).toLocaleDateString()}</p>
                <p><strong>LinkedIn:</strong> <a href="${profile.linkedin}" target="_blank">${profile.linkedin}</a></p>
                <p><strong>Twitter:</strong> <a href="${profile.twitter}" target="_blank">${profile.twitter}</a></p>
                <p><strong>GitHub:</strong> <a href="${profile.github}" target="_blank">${profile.github}</a></p>
                <button onclick="deleteProfile('${profile.email}')">Sil</button>
                <button onclick="updateProfile('${profile.email}')">Güncelle</button>
                <hr>
            `;
            profilesContainer.appendChild(profileElement);
        });
    } catch (error) {
        console.error('Profiller yüklenirken hata oluştu:', error);
    }
}

async function deleteProfile(email) {
    try {
        const response = await fetch('http://localhost:3001/profile', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });

        if (response.ok) {
            alert('Profil başarıyla silindi.');
            loadProfiles();
        } else {
            alert('Profil silinemedi.');
        }
    } catch (error) {
        console.error('Profil silinirken hata oluştu:', error);
    }
}

async function updateProfile(email) {
    const newUsername = prompt('Yeni kullanıcı adını girin:');
    const newPhone = prompt('Yeni telefon numarasını girin:');
    const newBirthdate = prompt('Yeni doğum tarihini girin (YYYY-AA-GG):');
    const newLinkedin = prompt('Yeni LinkedIn profilini girin:');
    const newTwitter = prompt('Yeni Twitter profilini girin:');
    const newGithub = prompt('Yeni GitHub profilini girin:');

    try {
        const response = await fetch('http://localhost:3001/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                username: newUsername,
                phone: newPhone,
                birthdate: newBirthdate,
                linkedin: newLinkedin,
                twitter: newTwitter,
                github: newGithub
            })
        });

        if (response.ok) {
            alert('Profil başarıyla güncellendi.');
            loadProfiles();
        } else {
            alert('Profil güncellenemedi.');
        }
    } catch (error) {
        console.error('Profil güncellenirken hata oluştu:', error);
    }
}

// Sayfa yüklendiğinde profilleri yükle
document.addEventListener('DOMContentLoaded', loadProfiles);
