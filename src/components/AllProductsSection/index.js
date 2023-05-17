import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const constantActiveStatus = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'Failure',
}

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    activeOptionId: sortbyOptions[0].optionId,
    titleSearch: '',
    category: '',
    rating: '',
    activeStatus: constantActiveStatus.initial,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      activeStatus: constantActiveStatus.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, titleSearch, category, rating} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${category}&title_search=${titleSearch}&rating=${rating}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      console.log(updatedData)
      this.setState({
        productsList: updatedData,
        activeStatus: constantActiveStatus.success,
      })
    } else if (response.status === 401) {
      this.setState({
        activeStatus: constantActiveStatus.failure,
      })
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  updateSearchInput = searchData => {
    this.setState({titleSearch: searchData}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId, titleSearch} = this.state
    const filteredData = productsList.filter(eachItem =>
      eachItem.title.toLowerCase().includes(titleSearch.toLowerCase()),
    )

    // TODO: Add No Products View
    const noProductView = () => (
      <div className="no-product-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
          className="no-product-image"
          alt="no products"
        />
        <h1 className="no-product-heading">No Products Found</h1>
        <p className="no-product-description">
          We could not find any products.Try other filters.
        </p>
      </div>
    )
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        {filteredData.length === 0 ? (
          <div>{noProductView()}</div>
        ) : (
          <ul className="products-list">
            {filteredData.map(product => (
              <ProductCard productData={product} key={product.id} />
            ))}
          </ul>
        )}
      </div>
    )
  }

  onUpdatingCategory = activeCategory => {
    this.setState({category: activeCategory}, this.getProducts)
  }

  onUpdatingRating = currentRating => {
    this.setState({rating: currentRating}, this.getProducts)
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view
  renderFailureView = () => (
    <div className="no-product-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        className="no-product-image"
        alt="products failure"
      />
      <h1 className="no-product-heading">Oops! Something Went Wrong</h1>
      <p className="no-product-description">
        We are having some trouble processing your request. Please try Again.
      </p>
    </div>
  )

  onClearingFilters = () => {
    this.setState(
      {
        titleSearch: '',
        category: '',
        rating: '',
      },
      this.getProducts,
    )
  }

  render() {
    const {isLoading, titleSearch, activeStatus} = this.state
    let updatedView = null
    switch (activeStatus) {
      case constantActiveStatus.inProgress:
        updatedView = this.renderLoader()
        break
      case constantActiveStatus.success:
        updatedView = this.renderProductsList()
        break
      case constantActiveStatus.failure:
        updatedView = this.renderFailureView()
        break
      default:
        updatedView = null
        break
    }

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          updateSearchInput={this.updateSearchInput}
          titleSearch={titleSearch}
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          onUpdatingCategory={this.onUpdatingCategory}
          onUpdatingRating={this.onUpdatingRating}
          onClearingFilters={this.onClearingFilters}
        />

        {updatedView}
      </div>
    )
  }
}

export default AllProductsSection
