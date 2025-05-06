

//PER ACONSEGUIR QUE S'ENVII EL CORREU SOTA LES MATEIXES CONDICIONS
// QUE LES DE POSAR VERD EL BOUNDING BOX (SEGUENT VENETLISTENER). S'activara nomes en cliar el borto d'enviar el correu al registre
function correuApte(strEmail) {
    const REGEX_EMAIL = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/; //regex de mail para gpt (no permet dos arrobes, força domini de minim 2 caràcters)
    return REGEX_EMAIL.test(strEmail);
}