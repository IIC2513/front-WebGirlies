import styles from './Landing.module.css';
import LogoutButton from '../profile/Logout';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext'; 
import Navbar from '../common/Navbar';

function LandingPage() {
  const { token } = useContext(AuthContext);

  return (
    <div>
      <Navbar />
      <div className={styles.MainLanding}>
        <h1 className={styles.title}>Murder in the hospital</h1>
        <div className={styles.description}>
          <p>
          Police game that revolves around solving a murder. There will be an impostor/murderer that players must discover. Players will have to gather clues and try to solve the crime, discovering both the location, the murderer and the weapon, but the impostor will try to divert attention so that he is not discovered.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;


