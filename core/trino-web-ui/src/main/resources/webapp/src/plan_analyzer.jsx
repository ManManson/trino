import React from 'react';
import ReactDOM from 'react-dom';
import { PlanAnalyzerPage } from './components/PlanAnalyzer/PlanAnalyzerPage';

window.React = React;
window.ReactDOM = ReactDOM;
window.PlanAnalyzerPage = PlanAnalyzerPage;

function mountApp() {
    if (window.React && window.ReactDOM && window.PlanAnalyzerPage) {
        ReactDOM.render(<PlanAnalyzerPage />, document.getElementById('root'));
    } else {
        console.error('Missing required components:', {
            React: !!window.React,
            ReactDOM: !!window.ReactDOM,
            PlanAnalyzerPage: !!window.PlanAnalyzerPage
        });
        document.getElementById('root').innerHTML =
            '<div class="alert alert-danger">Error loading Plan Analyzer. Please refresh.</div>';
    }
}

// Wait for everything to load
if (document.readyState === 'complete') {
    mountApp();
} else {
    window.addEventListener('load', mountApp);
}