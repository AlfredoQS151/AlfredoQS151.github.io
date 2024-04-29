document.addEventListener("DOMContentLoaded", function() {
    loadUserTable();
    var deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
    var resetPasswordModal = new bootstrap.Modal(document.getElementById('resetPasswordModal'));
    var currentUserEmailToDelete;
    var formModal = new bootstrap.Modal(document.getElementById('mdlUsuario'));

    document.querySelector("#tblUsuarios tbody").addEventListener("click", function(e) {
        if (e.target.classList.contains('btn-delete')) {
            currentUserEmailToDelete = e.target.dataset.email;
            deleteModal.show();
        }
        if (e.target.classList.contains('edit-link')) {
            const userEmail = e.target.getAttribute('data-email');
            editUser(userEmail);
        }
        if (e.target.classList.contains('btn-reset-password')) {
            const userEmail = e.target.dataset.email;
            document.getElementById('resetPasswordModal').querySelector('.btn-primary').dataset.email = userEmail;
            resetPasswordModal.show();
        }
        
    });
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('edit-link')) {
            e.preventDefault();
            var currentModal = bootstrap.Modal.getInstance(document.getElementById('mdlUsuario'));
            if (currentModal) {
                currentModal.hide();
            }
    
            const userEmail = e.target.getAttribute('data-email');
            const user = getUserByEmail(userEmail);
            loadEditUserModal(user);
            var editModal = new bootstrap.Modal(document.getElementById('mdlEditarUsuario'));
            editModal.show();
        }
    });
    
  document.getElementById('frmResetPassword').addEventListener('submit', function(e) {
    e.preventDefault();

    var newPassword = document.getElementById('txtNewPassword').value;
    var confirmNewPassword = document.getElementById('txtConfirmNewPassword').value;

    if (newPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return false; 
    }

    if (newPassword !== confirmNewPassword) {
      alert('Las contraseñas no coinciden.');
      return false;
    }

    updatePassword(newPassword);
  });

    document.getElementById("confirmDelete").addEventListener("click", function() {
        deleteUser(currentUserEmailToDelete);
        deleteModal.hide();
    });

    document.getElementById("btnAceptar").addEventListener("click", function(e) {
        e.preventDefault();
        if (addUser()) {
            formModal.hide();
        }
    });
    document.getElementById("frmResetPassword").addEventListener("submit", function(e) {
        e.preventDefault();
        const newPassword = document.getElementById("txtNewPassword").value;
        const confirmNewPassword = document.getElementById("txtConfirmNewPassword").value;
        const email = e.target.querySelector('.btn-primary').dataset.email;
    
        if (newPassword !== confirmNewPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }
    
        updatePassword(email, newPassword);
    });
});

document.getElementById('mdlUsuario').addEventListener('show.bs.modal', function (e) {
    document.getElementById("txtNombre").value = '';
    document.getElementById("txtEmail").value = '';
    document.getElementById("txtPassword").value = '';
    document.getElementById("txtConfirmarPassword").value = '';
    document.getElementById("txtTelefono").value = '';
    document.getElementById("txtEmail").disabled = false;
});

document.getElementById('mdlEditarUsuario').addEventListener('hidden.bs.modal', function (e) {
    document.getElementById("editTxtNombre").value = '';
    document.getElementById("editTxtEmail").value = '';
    document.getElementById("editTxtTelefono").value = '';
    document.getElementById("editTxtEmail").disabled = false;

    var backdrops = document.getElementsByClassName('modal-backdrop');
    while(backdrops.length > 0){
        backdrops[0].parentNode.removeChild(backdrops[0]);
    }
    document.body.style.overflow = '';
});
document.addEventListener("DOMContentLoaded", function() {
    var inputNombre = document.getElementById('txtNombre');
    inputNombre.addEventListener('input', function(e) {
        var valor = e.target.value;
        validateField(e.target, valor.length >= 2 && valor.length <= 60);
    });

    var inputEmail = document.getElementById('txtEmail');
    inputEmail.addEventListener('input', function(e) {
        var valor = e.target.value;
        validateField(e.target, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)); // Expresión regular básica para email
    });

    var inputPassword = document.getElementById('txtPassword');
    inputPassword.addEventListener('input', function(e) {
        var valor = e.target.value;
        validateField(e.target, valor.length >= 6 && valor.length <= 20);
    });

    var inputConfirmarPassword = document.getElementById('txtConfirmarPassword');
    inputConfirmarPassword.addEventListener('input', function(e) {
        var valor = e.target.value;
        var password = document.getElementById('txtPassword').value;
        validateField(e.target, valor === password);
    });

    var inputTelefono = document.getElementById('txtTelefono');
    inputTelefono.addEventListener('input', function(e) {
        var valor = e.target.value;
        validateField(e.target, /^\d{10}$/.test(valor)); 
    });
});

function validateField(field, isValid) {
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
    }
}
document.getElementById('editTxtNombre').addEventListener('input', function(e) {
    const valor = e.target.value;
    validateField(e.target, valor.length >= 2 && valor.length <= 60);
});

document.getElementById('editTxtTelefono').addEventListener('input', function(e) {
    const valor = e.target.value;
    validateField(e.target, /^\d{10}$/.test(valor)); 
});
document.getElementById('txtNewPassword').addEventListener('input', function(e) {
    const valor = e.target.value;
    validateField(e.target, valor.length >= 6 && valor.length <= 20);
});

document.getElementById('txtConfirmNewPassword').addEventListener('input', function(e) {
    const newPassword = document.getElementById('txtNewPassword').value;
    const confirmPassword = e.target.value;
    validateField(e.target, confirmPassword === newPassword);
});

function updateUser(editedUser) {
    let users = JSON.parse(localStorage.getItem("listaUsuarios")) || [];
    let existingUser = users.find(user => user.email === editedUser.oldEmail);

    if (existingUser) {
        existingUser.nombre = editedUser.nombre;
        existingUser.email = editedUser.email; 
        existingUser.telefono = editedUser.telefono;
    }

    localStorage.setItem("listaUsuarios", JSON.stringify(users));
    loadUserTable();
}
document.getElementById("btnEditarAceptar").addEventListener("click", function(e) {
    e.preventDefault();

    var oldEmail = getUserByEmail(document.getElementById("editTxtEmail").dataset.oldEmail).email; 
    var editedUser = {
        oldEmail: oldEmail,
        nombre: document.getElementById("editTxtNombre").value,
        email: document.getElementById("editTxtEmail").value,
        telefono: document.getElementById("editTxtTelefono").value
    };
    
    updateUser(editedUser);

    var editModal = bootstrap.Modal.getInstance(document.getElementById('mdlEditarUsuario'));
    editModal.hide();
});


function getUserByEmail(email) {
    let users = JSON.parse(localStorage.getItem("listaUsuarios")) || [];
    return users.find(user => user.email === email);
}
function loadEditUserModal(user) {
    document.getElementById("editTxtNombre").value = user.nombre;
    
    var emailField = document.getElementById("editTxtEmail");
    emailField.value = user.email;
    emailField.removeAttribute('disabled'); 
    emailField.dataset.oldEmail = user.email;
    document.getElementById("editTxtTelefono").value = user.telefono;
}

document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('edit-link')) {
        e.preventDefault();
        const userEmail = e.target.getAttribute('data-email');
        const user = getUserByEmail(userEmail);
        loadEditUserModal(user);
        var editModal = new bootstrap.Modal(document.getElementById('mdlEditarUsuario'));
        editModal.show();
    }
});
document.getElementById("btnEditarAceptar").addEventListener("click", function(e) {
    e.preventDefault();
    var user = {
        nombre: document.getElementById("editTxtNombre").value,
        email: document.getElementById("editTxtEmail").value,
        telefono: document.getElementById("editTxtTelefono").value
    };
    updateUser(user);
    var editModal = bootstrap.Modal.getInstance(document.getElementById('mdlEditarUsuario'));
    editModal.hide();
});
document.getElementById('mdlEditarUsuario').addEventListener('hidden.bs.modal', function (e) {
    var backdrops = document.getElementsByClassName('modal-backdrop');
    while(backdrops.length > 0){
        backdrops[0].parentNode.removeChild(backdrops[0]);
    }
    document.body.style.overflow = '';
});

function updatePassword(email, newPassword) {
    let users = JSON.parse(localStorage.getItem("listaUsuarios")) || [];
    console.log('Contraseña actualizada:', newPassword);
    users = users.map(user => {
        if (user.email === email) {
            user.contrasenia = newPassword;
        }
        return user;
    })
    var resetPasswordModal = bootstrap.Modal.getInstance(document.getElementById('resetPasswordModal'));
  resetPasswordModal.hide();;
    localStorage.setItem("listaUsuarios", JSON.stringify(users));
    loadUserTable();
}
function editUser(email) {
    const user = getUserByEmail(email);
    if (user) {
        document.getElementById("txtNombre").value = user.nombre;
        document.getElementById("txtEmail").value = user.email;
        var addUserModal = bootstrap.Modal.getInstance(document.getElementById('mdlUsuario'));
        document.getElementById("txtTelefono").value = user.telefono;
        if (addUserModal) {
            addUserModal.hide();
        }
    }
}
function addUser() {
    var name = document.getElementById("txtNombre").value;
    var email = document.getElementById("txtEmail").value;
    var password = document.getElementById("txtPassword").value;
    var confirmPassword = document.getElementById("txtConfirmarPassword").value;
    var phone = document.getElementById("txtTelefono").value;

    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return false;
    }

    var newUser = {nombre: name, email: email, contrasenia: password, telefono: phone};
    var users = JSON.parse(localStorage.getItem("listaUsuarios")) || [];
    if (users.some(user => user.email === email)) {
        alert("Ya existe un usuario con ese correo electrónico.");
        return false;
    }

    users.push(newUser);
    localStorage.setItem("listaUsuarios", JSON.stringify(users));
    loadUserTable();
    return true;
}

function deleteUser(email) {
    var users = JSON.parse(localStorage.getItem("listaUsuarios")) || [];
    var filteredUsers = users.filter(user => user.email !== email);
    localStorage.setItem("listaUsuarios", JSON.stringify(filteredUsers));
    loadUserTable();
}

function loadUserTable() {
    var users = JSON.parse(localStorage.getItem("listaUsuarios")) || [];
    var tbody = document.querySelector("#tblUsuarios tbody");
    tbody.innerHTML = '';
    if (users.length === 0) {
        var row = document.createElement("tr");
        row.innerHTML = `<td colspan="4" class="text-center">No hay usuarios registrados.</td>`;
        tbody.appendChild(row);
    } else {
        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
        <td><a href="#" class="edit-link" data-email="${user.email}" data-bs-toggle="modal" data-bs-target="#mdlUsuario">${user.nombre}</a></td>
        <td>${user.email}</td>
        <td>${user.telefono}</td>
        <td>
            <button class="btn btn-warning btn-reset-password" data-email="${user.email}" data-bs-toggle="modal" data-bs-target="#resetPasswordModal">Restablecer Contraseña</button>
            <button class="btn btn-danger btn-delete" data-email="${user.email}">Eliminar</button>
        </td>`;
            tbody.appendChild(row);
        });
    }
}
