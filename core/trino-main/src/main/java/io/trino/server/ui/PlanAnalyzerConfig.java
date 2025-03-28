package io.trino.server.ui;

import io.airlift.configuration.Config;

public class PlanAnalyzerConfig
{
    private String apiKey;
    private String serviceUrl = "http://localhost:8000/v1/api/analyze";

    @Config("plan-analyzer.api-key")
    public PlanAnalyzerConfig setApiKey(String apiKey)
    {
        this.apiKey = apiKey;
        return this;
    }

    @Config("plan-analyzer.service-url")
    public PlanAnalyzerConfig setServiceUrl(String serviceUrl)
    {
        this.serviceUrl = serviceUrl;
        return this;
    }

    public String getApiKey()
    {
        return apiKey;
    }

    public String getServiceUrl()
    {
        return serviceUrl;
    }
}