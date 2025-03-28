package io.trino.server.ui;

import com.google.inject.Inject;
import io.airlift.http.client.HttpClient;
import io.airlift.http.client.Request;
import io.airlift.http.client.Response;
import io.airlift.http.client.StaticBodyGenerator;
import io.trino.server.security.ResourceSecurity;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import io.airlift.http.client.ResponseHandler;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.ByteArrayOutputStream;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.Future;
import com.google.gson.Gson;
import io.airlift.configuration.Config;

import static io.trino.server.security.ResourceSecurity.AccessType.PUBLIC;

@Path("/ui/api/analyze")
public class PlanAnalyzerResource {
    private static final String ANALYSIS_SERVICE_URL = "http://localhost:8000/v1/api/analyze";
    private final HttpClient httpClient;
    private final PlanAnalyzerConfig config;

    @Inject
    public PlanAnalyzerResource(
            HttpClient httpClient,
            PlanAnalyzerConfig config) {
        this.httpClient = httpClient;
        this.config = config;
    }

    @ResourceSecurity(PUBLIC)
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String analyzePlan(String query) {
        try {
            // Use GSON library for safer serialization
            PlanAnalyzerSendPayload payloadModelObj = new PlanAnalyzerSendPayload();
            payloadModelObj.sqlQuery = query;
            payloadModelObj.apiKey = this.config.getApiKey();
            String payload = new Gson().toJson(payloadModelObj);

            Request request = Request.builder()
                    .setUri(URI.create(ANALYSIS_SERVICE_URL))
                    .setMethod("POST")
                    .setHeader("Content-Type", MediaType.APPLICATION_JSON)
                    .setBodyGenerator(StaticBodyGenerator.createStaticBodyGenerator(
                            payload, StandardCharsets.UTF_8))
                    .build();

            Future<String> responseFuture = httpClient.executeAsync(request, new ResponseHandler<String, Exception>()
            {
                @Override
                public String handleException(Request request, Exception exception)
                {
                    return "";
                }

                @Override
                public String handle(Request request, Response response)
                {
                    try {
                        InputStream strm = response.getInputStream();

                        ByteArrayOutputStream result = new ByteArrayOutputStream();
                        byte[] buffer = new byte[102400];
                        for (int length; (length = strm.read(buffer)) != -1; ) {
                            result.write(buffer, 0, length);
                        }

                        String resString = result.toString("UTF-8");
                        System.out.println(resString);

                        Gson gson = new Gson();
                        ResponseFromAnalyzer r = gson.fromJson(resString, ResponseFromAnalyzer.class);
                        return r.analysis;
                    }
                    catch(Exception e) {
                        e.printStackTrace();
                        return "ERROR: Invalid response";
                    }
                }
            });

            return responseFuture.get();
        } catch (Exception e) {
            e.printStackTrace();
            return "ERROR: Plan analyze failed";
        }
    }
}