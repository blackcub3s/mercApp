package miApp.app;

import miApp.app.Usuaris.model.Usuari;
import miApp.app.Usuaris.servei.UsuariAmpliatServei;
import miApp.app.utils.EncriptaContrasenyes;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import miApp.app.Usuaris.servei.UsuariServei;
import miApp.app.Usuaris.servei.UsuariAmpliatServei;


@SpringBootApplication
public class AppApplication {
	public static void main(String[] args) {

		//SpringApplication.run(AppApplication.class, args);

		ApplicationContext context = SpringApplication.run(AppApplication.class, args); //obtens context
		UsuariServei usuariServei = context.getBean(UsuariServei.class); //obtens la bean del context per pillar classe usuariServei



		//TESTEJO AFEGIR USUARI (EL PRIMER TÉ ACCÉS A RECURSOS, EL SEGON NO TÉ ACCÉS -es un usuari que ha registrat nom pero mai ha arribat a guanyar permisos-)
		boolean afegit = usuariServei.afegirUsuari("superacces@gmail.com",
													"12345678Mm_",
													"the protein kingdom",
													(byte) 2); //ES ADMIN

		boolean afegitDos = usuariServei.afegirUsuari("acces@gmail.com",
													"12345678Mm_",
												"blackcub3s",
													(byte) 1); //ES USER

		boolean afegitTres = usuariServei.afegirUsuari("noacces@gmail.com",
				  									   "12345678Mm_",
				                                 "pinkcub3s",
				                                       (byte) 0); //JA TENIM MAIL I CONTRA GUARDATS, PERO NO TE RECURSOS

		UsuariAmpliatServei usuariAmpliatServei = context.getBean(UsuariAmpliatServei.class);

		Usuari u = usuariServei.trobaUsuariPerEmail("superacces@gmail.com");
		Usuari usuariBis = usuariServei.trobaPerId(2).get();

		usuariAmpliatServei.afegirNomIcognoms(u, "Santi", "Sánchez", "Sans");
		usuariAmpliatServei.afegirNomIcognoms(usuariBis, "Emma", "Palausabulla", "Balluback");

	}
}
