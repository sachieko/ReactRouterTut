import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import './index.css'
import Root, { loader as rootLoader, action as rootAction } from './routes/root';
import ErrorPage from './ErrorPage';
import Contact, {
  loader as contactLoader,
  action as contactAction,
} from './routes/Contact';
import EditContact, {
  action as editAction,
} from './routes/Edit';
import { action as destroyAction } from "./routes/Destroy";
import Index from './routes';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      { index: true, element: <Index /> },
      {
        path: "contacts/:contactId",
        element: <Contact />,
        loader: contactLoader,
        action: contactAction,
        errorElement: <div>Oops! There was an error, likely a missing feature.</div>,
      },
      {
        path: "contacts/:contactId/edit",
        element: <EditContact />,
        loader: contactLoader, // Normally would have its own route, only done for convenience
        action: editAction,
        errorElement: <div>Oops! There was an error.</div>,
      },
      {
        path: "contacts/:contactId/destroy",
        action: destroyAction,
        errorElement: <div>Oops! There was an error.</div>
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
