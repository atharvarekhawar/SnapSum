import { useState, useEffect } from 'react'
import { copy, linkIcon, loader, tick } from '../assets'
import axios from 'axios';

const Demo = () => {
  const options = {
    method: 'GET',
    url: 'https://article-extractor-and-summarizer.p.rapidapi.com/summarize',
    params: {
      url: '',
      length: '3'
    },
    headers: {
      'X-RapidAPI-Key': '',
      'X-RapidAPI-Host': 'article-extractor-and-summarizer.p.rapidapi.com'
    }
  };

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(localStorage.getItem('articles'));

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  // const [options, setOptions] = useState(optionsDemo);
  const [article, setArticle] = useState({
    url: '',
    summary: '',
  });
  const [allArticles, setAllArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    options.params.url = article.url;
    setIsLoading(true);
    try {
      const response = await axios.request(options);
      if (response.data?.summary) {
        const newArticle = { ...article, summary: response.data.summary };
        const updatedArticles = [...allArticles, newArticle];

        setArticle(newArticle);
        setAllArticles(updatedArticles);

        localStorage.setItem('articles', JSON.stringify(updatedArticles));
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }

  return (
    <section className='mt-16 w-full max-w-xl'>
      <div className='flex flex-col w-full gap-2'>
        <form
          className='relative flex justify-center items-center'
          onSubmit={handleSubmit}
        >
          <img src={linkIcon} alt='link_icon'
            className='w-5 absolute left-0 my-2 ml-3'
          />
          <input
            type="url"
            placeholder='Enter a URL'
            value={article.url}
            onChange={(e) => {
              setArticle({
                ...article,
                url: e.target.value
              })
            }}
            required
            className='url_input peer'
          />

          <button type='submit'
            className='submit_btn peer-focus:border-gray-700
           peer-focus:text-gray-700'>
            💼
          </button>
        </form>

        <div className='flex flex-col gap-1 max-h-60 overflow-y-auto'>
          {allArticles.map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className='link_card'
            >
              <div className='copy_btn'>
                <img src={copy} alt="copy"
                  className='w-[40%] h-[40%] object-contain'
                />
              </div>
              <p className='flex-1 font-satoshi text-blue-700 font-medium text-sm truncate'>
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className='my-10 max-w-full flex justify-center items-center'>
        {isLoading ? (
          <img src={loader} alt='loader' className='w-20 h-20 object-contain' />
        ) : (
          article.summary && (
            <div className='flex flex-col gap-3'>
              <h2 className='font-satoshi font-bold text-gray-600 text-xl'>
                Article <span className='blue_gradient'>Summary</span>
              </h2>
              <div className='summary_box'>
                <p className='font-inter font-medium text-sm text-gray-700'>
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  )
}

export default Demo
