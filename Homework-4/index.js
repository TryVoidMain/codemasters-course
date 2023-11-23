function validateForm() {
    var form = document.forms["registrationForm"];
    if (form["fio"] === null || form["fio"].value === "") {
        alert("input fio");
        return false;
    }
    
    return true;
}
