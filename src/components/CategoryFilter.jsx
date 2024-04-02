import { CATEGORIES } from '../data';

const CategoryFilter = ({ setCurrentCategory }) => {
  return (
    <aside>
      <ul>
        <li className='category'>
          <button
            onClick={() => {
              setCurrentCategory('all');
            }}
            className='btn btn-all-categories'
          >
            All
          </button>
        </li>
        {CATEGORIES.map((item) => (
          <li key={item.name} className='category'>
            <button
              onClick={() => {
                setCurrentCategory(item.name);
              }}
              className='btn btn-category'
              style={{ backgroundColor: item.color }}
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default CategoryFilter;
