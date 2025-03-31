package miApp.app;

import miApp.app.utils.EncriptaContrasenyes;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import miApp.app.Usuaris.servei.UsuariServei;


@SpringBootApplication
public class AppApplication {
	public static void main(String[] args) {

		//SpringApplication.run(AppApplication.class, args);

		ApplicationContext context = SpringApplication.run(AppApplication.class, args); //obtens context
		UsuariServei usuariServei = context.getBean(UsuariServei.class); //obtens la bean del context per pillar classe usuariServei



		//TESTEJO AFEGIR USUARI (EL PRIMER TÉ ACCÉS A RECURSOS, EL SEGON NO TÉ ACCÉS -es un usuari que ha registrat nom pero mai ha arribat a guanyar permisos-)
		boolean afegit = usuariServei.afegirUsuari("acces@gmail.com",
													"123",
												"blackcub3s",
													(byte) 1);
		boolean afegitdos = usuariServei.afegirUsuari("noacces@gmail.com",
				  									   "123",
				                                 "pincub3s",
				                                       (byte) 0);


	}
}
