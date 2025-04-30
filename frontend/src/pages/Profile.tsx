import axios from '../hooks/axios/axios';
import { useEffect, useState } from 'react';
import styles from "../styles/Profile.module.css"; // Using your new module CSS
import { useSelector } from 'react-redux';

export default function Profile() {
  const [profile, setProfile] = useState({});

  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const user = useSelector((state : any) => state.user.user);

  useEffect(() => {
      axios.get(`/users/profile/${user._id}`)
        .then(({data}) => setProfile(data.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
  }, [user]);

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
      await axios.put(`/users/update/${user._id}`, { ...profile });
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
        type="phone"
        name="phone"
        value={profile.phone}
        onChange={handleChange}
        placeholder="Your Phone"
        className={styles.inputField}
      />
      <input
        type="email"
        name="email"
        value={profile.email}
        onChange={handleChange}
        placeholder="Your Email"
        className={styles.inputField}
      />

      

      <input
        type="date"
        name="dob"
        value={profile.dob.split("T")[0]}
        onChange={handleChange}
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
