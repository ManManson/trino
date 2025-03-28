package io.trino.server.ui;

import com.google.gson.annotations.SerializedName;

public class PlanAnalyzerSendPayload {
    @SerializedName("sql_query")
    public String sqlQuery;

    @SerializedName("api_key")
    public String apiKey;
}