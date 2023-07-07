import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { lazy, Suspense } from 'react';
import CommentSection from './component/Comment/Comments';
import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';
import Layout from './layout/Layout';
import ErrorLoadingPage from './pages/ErrorLoadingPage';

const MyPage = lazy(() => import('./component/MyPage/MyPage'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const MainFeed = lazy(() => import('./pages/MainFeed'));
const UserFeed = lazy(() => import('./pages/UserFeed'));
const KakaoLoading = lazy(() => import('./pages/KakaoLoading'));
const DiaryPage = lazy(() => import('./pages/DiaryPage'));

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Suspense fallback={<ErrorLoadingPage text="Loading" />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/mainfeed" element={<MainFeed />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="/diary" element={<DiaryPage />} />
              <Route path="/feed/:nickname" element={<UserFeed />} />
              <Route path="/errorloading" element={<ErrorLoadingPage />} />
              <Route path="/commentsection" element={<CommentSection />} />
            </Route>
            <Route path="/loading" element={<KakaoLoading />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/mypage" element={<MyPage />} />
          </Routes>
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
