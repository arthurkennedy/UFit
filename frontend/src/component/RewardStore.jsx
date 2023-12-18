//import images
import organicBar from "../assets/storeImages/organic-bar.jpg"
import organicChip from "../assets/storeImages/organic-chip.jpg"
import {useState} from "react";

const ProductCard = ({img, name, points, buyfunc, budget}) => {

    const handleBuyNow = () => {
        // Add logic for handling the "Buy Now" button click
        if (budget - points <= -1) {
            alert("Sorry, you cannot afford " + name + " for " + points + " points.");
        } else {
            buyfunc(points);
            console.log(`Buy Now clicked for ${points}`);
        }
    };

    return (

        <div className="product-card">

            <img src={img} alt={name} className="product-image"/>

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

const RewardStore = () => {
    const [points, setSessionPoints] = useState(3000);
    const decrement = (productPrice) => {
        setSessionPoints(points - productPrice)
    }


    return (
        <div className="page-contents-container">

            <div className="page-contents">
                <h1>Points Store ${points / 100}</h1>
            </div>

            <div className="page-contents">
                <div className="product-container">
                    <ProductCard img={organicBar} name='Organic bar' points='200' buyfunc={decrement}
                                 budget={points}></ProductCard>
                    <ProductCard img={organicChip} name='Organic chips' points='150' buyfunc={decrement}
                                 budget={points}></ProductCard>
                </div>
            </div>
            <div>
            </div>
        </div>
    )
};
export default RewardStore