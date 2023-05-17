import {BsSearch} from 'react-icons/bs'
import './index.css'

const FiltersGroup = props => {
  const {
    updateSearchInput,
    titleSearch,
    categoryOptions,
    ratingsList,
    onUpdatingCategory,
    onUpdatingRating,
    onClearingFilters,
  } = props
  //   const onInputChange = event => updateSearchInput(event.target.value)

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      const searchValue = event.target.value.trim()
      if (searchValue !== '') {
        updateSearchInput(searchValue)
      }
    }
  }

  const updateCategory = activeCategory => onUpdatingCategory(activeCategory)

  const updateRating = activeRating => onUpdatingRating(activeRating)

  const clearFilter = () => onClearingFilters()

  return (
    <div className="filters-group-container">
      <div className="input-container">
        <input
          type="search"
          className="input-element"
          placeholder="Search"
          //   value={titleSearch}
          //   onChange={onInputChange}
          onKeyDown={handleKeyDown}
        />
        <span className="search-icon">
          <BsSearch />
        </span>
      </div>
      <div className="category-container">
        <h1 className="category-heading">Category</h1>
        <ul>
          {categoryOptions.map(eachCategory => (
            <li className="category-list">
              <button
                className="category-button"
                onClick={() => updateCategory(eachCategory.categoryId)}
              >
                <p>{eachCategory.name}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="category-container">
        <h1 className="category-heading">Rating</h1>
        <ul>
          {ratingsList.map(eachItem => (
            <li className="rating-list">
              <img
                src={eachItem.imageUrl}
                alt={`rating ${eachItem.ratingId}`}
                className="rating-image"
              />
              <button
                className="rating-button"
                onClick={() => updateRating(eachItem.ratingId)}
              >
                & up
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button className="clear-button" onClick={clearFilter}>
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
