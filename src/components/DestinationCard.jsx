const DestinationCard = ({ destination, onSelect }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-80 cursor-pointer hover:scale-105 transition-transform" onClick={() => onSelect(destination)}>
      <img src={destination.image_url} alt={destination.name} className="w-full h-40 object-cover rounded-md mb-4" />
      <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
      <p className="text-gray-600 mb-2">{destination.country}</p>
      <p className="text-gray-500 text-sm">{destination.description?.slice(0, 100)}...</p>
    </div>
  );
};

export default DestinationCard;