//import images 
import organicBar from "../assets/storeImages/organic-bar.jpg"
import organicChip from "../assets/storeImages/organic-chip.jpg"

const ProductCard = ({ img, name, points }) => {

    const handleBuyNow = () => {
        // Add logic for handling the "Buy Now" button click
        console.log(`Buy Now clicked for ${points}`);
    };

    return (

        <div className="product-card">
            
            <img src={img} alt={name} className="product-image" />

            <div className="product-details">
                <h2 className="product-name">{name}</h2>
                <p className="product-points">Points: {points}</p>

                <button className="buy-now-button" onClick={handleBuyNow}>
                    Buy Now
                </button>
            </div>

        </div>

    );
};

const RewardStore =()=>{
    return(
        <div className="page-contents-container">

            <div className="page-contents">
                <h1>Points Store</h1>
                {/*
                <details>
                    <summary>The plan</summary>
                    <p> - Hardcode product
                        - Points for each
                        - Purchase
                        - Enough points? Decrement.
                        - backend call? Just user points
                        - Not really gonna use amazon for now</p>
                </details>*/
                }
                

            </div>

            <div className="page-contents">
                <div className="product-container">

                    <ProductCard img={organicBar} name='Organic bar' points='200'></ProductCard>
                    <ProductCard img={organicChip} name='Organic chip' points='150'></ProductCard>
                </div>
            </div>
            <div>
            </div>
        </div>
    )
};
export default RewardStore