package miApp.app.tickets.restclient;


import miApp.app.tickets.dto.TestDTO;
import miApp.app.tickets.dto.TicketDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.HashMap;

@Component
public class Client {

    private final RestClient restClient;

    //TOKEN SENSE CADUCITAT QUE UTILITZEM PER ENVIAR AL BACKEND DE FASTAPI QUE VOLDREM QUE CORROBORI L'ORIGEN
    private String token = "eyJhbGciOiJIUzI1NiJ9.eyJvcmlnZW4iOiJiYWNrLWVuZCBzcHJpbmcgYm9vdCIsImlhdCI6MTc0NDE5NTkzNH0.vWyws2xGbb2K_Q2idc_GA_joqONMiWKVSwSCE7yqlvs";

    public Client(RestClient restClient) {
        this.restClient = restClient;
    }



    //TESTEJAR
    public TicketDTO getSenseToken(Integer idUsuari) {
        return restClient.get()//FA LA SOLICITUD GET
                .uri("http://localhost:8000/api/usuari/{idUsuari}", idUsuari) //el http://localhost:8000 ja esta definit dins ConfiguracioRestClient
                .retrieve()//fa solicitud HTTP
                .body(TicketDTO.class); //EL TIPUS DE CLASSE QUE RETORNA LA FUNCIÓ
    }

    public TestDTO getAmbToken(Integer idUsuari) {
        return restClient.get()//FA LA SOLICITUD GET
                .uri("http://localhost:8000/api/usuariSegur/{idUsuari}", idUsuari) //el http://localhost:8000 ja esta definit dins ConfiguracioRestClient
                .header("Authorization", "Bearer "+token)
                .retrieve()//fa solicitud HTTP
                .body(TestDTO.class); //EL TIPUS DE CLASSE QUE RETORNA LA FUNCIÓ
    }




    public static void main(String[] args) {
        Client clientet = new Client(RestClient.builder().build());
        TicketDTO dto = clientet.getSenseToken(6);
        System.out.println(dto.getDadesUsuari());

        TestDTO dtoBis = clientet.getAmbToken(6);
        System.out.println("rebut: "+dtoBis.getAuthToken());


    }
}
