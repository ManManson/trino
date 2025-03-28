package io.trino.server.ui;

import com.google.inject.Binder;
import com.google.inject.Scopes;
import io.airlift.configuration.AbstractConfigurationAwareModule;
import io.airlift.http.client.HttpClient;
import io.airlift.http.client.HttpClientConfig;
import io.airlift.http.client.jetty.JettyHttpClient;
import io.airlift.units.Duration;

import static io.airlift.configuration.ConfigBinder.configBinder;
import static io.airlift.jaxrs.JaxrsBinder.jaxrsBinder;
import static java.util.concurrent.TimeUnit.SECONDS;

public class PlanAnalyzerModule extends AbstractConfigurationAwareModule {
    @Override
    protected void setup(Binder binder) {
        HttpClientConfig config = new HttpClientConfig()
                .setConnectTimeout(new Duration(60, SECONDS))
                .setRequestTimeout(new Duration(60, SECONDS));

        binder.bind(HttpClient.class)
                .toProvider(() -> new JettyHttpClient(config))
                .in(Scopes.SINGLETON);

        configBinder(binder).bindConfig(PlanAnalyzerConfig.class);
        jaxrsBinder(binder).bind(PlanAnalyzerResource.class);
    }
}