package miApp.app.Usuaris.servei;

import miApp.app.Usuaris.dto.FormulariDTO;
import miApp.app.Usuaris.dtoSORTIDA.FormulariDTOsortida;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class CorreuServei {

    private final JavaMailSender enviadorMails;

    @Autowired
    public CorreuServei(JavaMailSender enviadorMails) {
        this.enviadorMails = enviadorMails;
    }

    //PRE: Les dades d'entrada en el DTO (el dto te ja dades valides en l'entrada! nom, mail i comentari del formualri)
    //POST: Si s'ha enviat el mail torno true i si no false a traves del FormulariDTOSortida. també un missatge adient.
    public FormulariDTOsortida enviaMail(FormulariDTO dto) {
        try {


            // AQUI FER ENVIAR CORREU
            SimpleMailMessage missatge = new SimpleMailMessage();
            missatge.setTo("blackcub3sss@gmail.com"); // MISSATGE DE CORREU A ON S'ENVIARAN ELS FORMULARIS DE CONTACTE
            missatge.setSubject("mercApp | Escrit de: " + dto.getNom());
            missatge.setText(dto.getComentaris()+ " || Contestar al mail informat per l'usuari: <"+dto.getCorreuElectronic()+">");
            enviadorMails.send(missatge);
            // FI ENVIAMENT CORREU



            //Aprofitem el DTO de sortida per mostrar les dades en l'API (en el cos de la response)
            return new FormulariDTOsortida(true, "Formulario enviado correctamente al correo del admin");
        } catch (Exception e) {
            return new FormulariDTOsortida(false, "Error mandando el formulario por correo: " + e.getMessage());
        }
    }


}
