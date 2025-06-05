import './App.scss';
import { useState, useEffect, useTransition, use, useCallback } from 'react';


const url1 = 'https://api-sage-two-60.vercel.app/mocks/issues/1?delay=2000';
const url2 = 'https://api-sage-two-60.vercel.app/mocks/issues/2?delay=1000';

const Page = ({id}) => {
  const [data, setData] = useState({});
  // const [isLoading, setLoading] = useState(false);
  const [isLoading, startTransition] = useTransition();
  const url = id === '1' ? url1 : url2;

  console.log('Page, id:', id, 'data: ', data )
  const fetchData = useCallback(() => {
    startTransition(async function () {
      const response = await fetch(url)
      const newData = await response.json();
      
      startTransition(async function () {
          setData(newData);
        }
      );
    });
  }, [url, startTransition]);


  //! так позволяет убрать блики, но не позволяет отрисовать данные последнего нажатого id
  useEffect(() => {
    console.log('useEffect')
    fetchData()
  }, [fetchData, url]);

  //! исходная версия
  // useEffect(() => {
  //   setLoading(true);
  //   fetch(url)
  //     .then((r) => r.json())
  //     .then((r) => {
  //       setData(r);
  //       console.log(r);
  //       setLoading(false);
  //     });
  // }, [url]);

  if (!data.id || isLoading) return <>loading issue {id}</>;

  return (
    <div>
      <h1>My issue number {data.id}</h1>
      <h2>{data.title}</h2>
      <p>{data.description}</p>
    </div>
  );
};

const App = () => {
  const [page, setPage] = useState('1');

  // видимо, чтобы загрузить те данные, которые были нажаты последними, а не загружены последними, нужно вынести state data на уровень App
  // и получить data через useTransition, затем передать его в Page

  // или создать стейт с data тут, как и isLoading, но setState перенести в Page

  return (
    <div className="App">
      <div className="container">
        <ul className="column">
          <li>
            <button className="button" onClick={() => setPage('1')} disabled={page === '1'}>
              Issue 1
            </button>
          </li>
          <li>
            <button className="button" onClick={() => setPage('2')} disabled={page === '2'}>
              Issue 2
            </button>
          </li>
        </ul>

        <Page id={page}/>
      </div>
    </div>
  );
};

export default App;