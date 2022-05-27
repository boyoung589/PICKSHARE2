import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MyPage from './component/MyPage/MyPage';
import Login from './component/User/Login/Login';
import Signup from './component/User/Signup/Signup';
import GlobalStyles from './GlobalStyles';
import ErrorPage from './pages/ErrorPage';
// import DiaryPage from './pages/DiaryPage';
import LandingPage from './pages/LandingPage';
import Loading from './pages/Loading';
import MainFeed from './pages/MainFeed';
import UserFeed from './pages/UserFeed';

function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/*  <Route path="/diary" element={<DiaryPage />} /> */}
        <Route path="/mainfeed" element={<MainFeed />} />
        <Route path="/feed/:nickname" element={<UserFeed />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="error" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
