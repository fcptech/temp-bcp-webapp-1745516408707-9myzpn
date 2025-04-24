import { login } from './pages/login';
import { dashboard } from './pages/dashboard';
import { account } from './pages/account';
import { nav } from './components/nav';
import { common } from './components/common';

export default {
  login: login.pt,
  dashboard: dashboard.pt,
  account: account.pt,
  nav: nav.pt,
  common: common.pt
};