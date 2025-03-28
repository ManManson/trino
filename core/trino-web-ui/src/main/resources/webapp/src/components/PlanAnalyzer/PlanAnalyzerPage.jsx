import React from 'react';
import Editor from '@monaco-editor/react';

export class PlanAnalyzerPage extends React.Component {
    state = {
        query: '',
        analysis: '',
        isLoading: false,
        error: null,
        editorTheme: 'vs-dark'
    };

    editorOptions = {
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollbar: {
            vertical: 'auto',
            horizontal: 'auto'
        },
        formatOnPaste: true,
        formatOnType: true
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

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Analysis failed');
          }

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

      handleEditorChange = (value) => {
        this.setState({ query: value });
      };

      handleEditorMount = (editor, monaco) => {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
            this.analyzeQuery();
        });
      };

      render() {
        return (
            <div className="container" style={{ padding: '20px' }}>
                <h1>Plan Analyzer</h1>

                <button
                    onClick={() => this.setState({ editorTheme: this.state.editorTheme === 'vs-dark' ? 'vs-light' : 'vs-dark' })}
                    className="btn btn-secondary"
                >
                    Toggle Editor Theme
                </button>

                {/* Input Editor */}
                <div style={{ margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px' }}>
                    <Editor
                        height="400px"
                        defaultLanguage="sql"
                        theme={this.state.editorTheme}
                        value={this.state.query}
                        onChange={this.handleEditorChange}
                        onMount={this.handleEditorMount}
                        options={this.editorOptions}
                        loading={<div>Loading editor...</div>}
                    />
                </div>

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
                        <div style={{ border: '1px solid #ccc', borderRadius: '4px' }}>
                            <Editor
                                height="300px"
                                defaultLanguage="json"
                                theme="vs-dark"
                                value={this.state.analysis}
                                options={{
                                    ...this.editorOptions,
                                    readOnly: true,
                                    lineNumbers: "off",
                                    minimap: { enabled: false },
                                    wordWrap: "on"
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default PlanAnalyzerPage;