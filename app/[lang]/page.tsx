import { getSites } from '@/lib/analytics';

export default async function Home() {
  const sites = await getSites();

  return (
    <ol>
      {sites.map(([name, count]) => (
        <li key={name}>
          <a href={`https://${name}`} target='_blank' rel='noreferrer'>
            <mark>{name}</mark>
            <small>{count} views</small>
          </a>
        </li>
      ))}
    </ol>
  );
}
