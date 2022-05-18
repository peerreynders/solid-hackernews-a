import { render } from 'solid-js/web';
import { Router, useRoutes } from 'solid-app-router';

import { routes } from './routes';
import { Nav } from './components/nav';

const Routes = useRoutes(routes);

function App() {
  return (
    <Router>
      <Nav />
      <Routes />
    </Router>
  );
}

const rootEl = document.getElementById('root');
if (rootEl) render(App, rootEl);
