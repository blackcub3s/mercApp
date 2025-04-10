package miApp.app.tickets.restclient;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

//CAL FER AQUESTA CLASSE DE CONFIGURACIÓ. EN CAS CONTRARI NO FUNCIONARAR RES DINS Client.java PER FER PETICIONS
//A FAST API.
@Configuration
public class ConfiguracioRestClient {

    //POTS VEURE DOCUMENTACIÓ --> https://docs.spring.io/spring-framework/reference/integration/rest-clients.html
    @Bean
    public RestClient restClient() {
        return RestClient.builder()
                .build();
    }
}