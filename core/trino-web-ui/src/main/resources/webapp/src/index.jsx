import React from 'react';
import ReactDOM from 'react-dom';
import { ClusterHUD } from './components/ClusterHUD';
import { QueryList } from './components/QueryList';
import { PageTitle } from './components/PageTitle';
import { PlanAnalyzerPage } from './components/PlanAnalyzer/PlanAnalyzerPage';

window.React = React;
window.ReactDOM = ReactDOM;
window.PageTitle = PageTitle;
window.PlanAnalyzerPage = PlanAnalyzerPage;


ReactDOM.render(<PageTitle title="Cluster Overview" />, document.getElementById('title'));
ReactDOM.render(<ClusterHUD />, document.getElementById('cluster-hud'));
ReactDOM.render(<QueryList />, document.getElementById('query-list'));