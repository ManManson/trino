import React from 'react';

export class PlanAnalyzerPage extends React.Component {
    state = {
        query: '',
        analysis: '',
        isLoading: false,
        error: null
    };

    analyzeQuery = async () => {
        this.setState({ isLoading: true, error: '' });
        try {
          const response = await fetch('/ui/api/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Trino-UI': 'true'
            },
            body: this.state.query
          });

          if (!response.ok) throw new Error(await response.text());
          this.setState({
            analysis: await response.text(),
            isLoading: false
        });
        } catch (err) {
            this.setState({
                error: err instanceof Error ? err.message : String(err),
                isLoading: false
            });
        }
      };

    render() {
        return (
            <div className="container" style={{ padding: '20px' }}>
                <h1>Plan Analyzer</h1>
                <textarea
                    className="form-control"
                    rows={10}
                    value={this.state.query}
                    onChange={(e) => this.setState({ query: e.target.value })}
                    style={{ margin: '10px 0' }}
                />
                <button
                    className="btn btn-primary"
                    onClick={this.analyzeQuery}
                    disabled={this.state.isLoading}
                >
                    {this.state.isLoading ? 'Analyzing...' : 'Analyze'}
                </button>

                {this.state.error && (
                    <div className="alert alert-danger" style={{ marginTop: '10px' }}>
                        {this.state.error}
                    </div>
                )}

                {this.state.analysis && (
                    <div style={{ marginTop: '20px' }}>
                        <h3>Results:</h3>
                        <pre style={{ whiteSpace: 'pre-wrap' }}>
                            {this.state.analysis}
                        </pre>
                    </div>
                )}
            </div>
        );
    }
}

export default PlanAnalyzerPage;