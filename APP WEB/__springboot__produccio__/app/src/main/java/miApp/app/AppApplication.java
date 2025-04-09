package miApp.app;

import miApp.app.Usuaris.model.Usuari;
import miApp.app.Usuaris.repositori.UsuariRepositori;
import miApp.app.Usuaris.servei.UsuariAmpliatServei;
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


		//OBTINC LA BEAN DE LES DUES CLASSES QUE FALTEN PER FER AQUEST TEST (EL USUARI AMPLIAT SERVEI I L'USUARI REPOSITORI)
		UsuariAmpliatServei usuariAmpliatServei = context.getBean(UsuariAmpliatServei.class);
		UsuariRepositori usuariRepositori = context.getBean(UsuariRepositori.class); //obtens la bean del context per pillar classe usuariServei

		Usuari u = usuariServei.trobaUsuariPerEmail("superacces@gmail.com");
		Usuari usuariBis = usuariRepositori.findById(2).get(); //acces@gmail.com

		usuariAmpliatServei.afegirNomIcognoms(u, "Santi", "Sánchez", "Sans");
		usuariAmpliatServei.afegirNomIcognoms(usuariBis, "Emma", "Palausabulla", "Balluback");



		//SI VOLS GENERAR EL TOKEN FIX PER A VERIFICAR LES CRIDADES AL BACKEND DE FAST API (DESCOMENTA SEGÜENTS LINIES)
		/*
		TokenFix tf = new TokenFix();
		String tokenFix = tf.generaTokenFix();
		System.out.println("TOKEN FIX PER A ENVIAR A BACK: " + tokenFix);
		*/

		//TESTEJO CLASSE QUE OBTE DADES DEL BACKEND FASAPI

		//SENSE TOKEN:

		/*
		RestClient restClient = new restClient();
		Client client = new Client(restClient);
		TicketDTO dtoT = client.getTickets(1);
		*/

		//AMB TOKEN
	}
}
