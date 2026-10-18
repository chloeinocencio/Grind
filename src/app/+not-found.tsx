import { Redirect } from 'expo-router';

/** Unknown links (an old deep link, or a hosted web preview) land on Home. */
export default function NotFound() {
  return <Redirect href="/" />;
}
