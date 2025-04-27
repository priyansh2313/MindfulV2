import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from "../styles/Profile.module.css"; // Using your new module CSS

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    profession: '',
    bio: '',
    preferences: {
      theme: 'light',
    },
  });

  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const email = localStorage.getItem('userEmail'); // assuming you saved it after login

  useEffect(() => {
    if (email) {
      axios.get(`/api/profile?email=${email}`)
        .then(res => setProfile(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setSaved(false);
      await axios.put('/api/profile', { email, ...profile });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000); // Hide success after 3 seconds
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.profileTitle}>My Profile</h2>

      <input
        type="text"
        name="name"
        value={profile.name}
        onChange={handleChange}
        placeholder="Your Name"
        className={styles.inputField}
      />

      <input
        type="number"
        name="age"
        value={profile.age}
        onChange={handleChange}
        placeholder="Your Age"
        className={styles.inputField}
      />

      <input
        type="text"
        name="profession"
        value={profile.profession}
        onChange={handleChange}
        placeholder="Your Profession"
        className={styles.inputField}
      />

      <textarea
        name="bio"
        value={profile.bio}
        onChange={handleChange}
        placeholder="Short Bio"
        className={`${styles.inputField} ${styles.textareaField}`}
      />

      <button onClick={handleSubmit} className={styles.saveButton}>
        Save Changes
      </button>

      {saved && (
        <div className={styles.successMessage}>
          🎉 Profile updated successfully!
        </div>
      )}
    </div>
  );
}
