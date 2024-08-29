import React, { useState, useEffect } from 'react';

const ItemForm = ({ selectedItem, setSelectedItem, refreshItems }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (selectedItem) {
            setName(selectedItem.name);
            setDescription(selectedItem.description);
        } else {
            setName('');
            setDescription('');
            setImage(null);
        }
    }, [selectedItem]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        if (image) {
            formData.append('image', image);
        }

        try {
            const url = selectedItem ? `http://localhost:5000/items/${selectedItem.id}` : 'http://localhost:5000/items';
            const method = selectedItem ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                body: formData,
            });
            const data = await response.json();
            console.log(data);
            setSelectedItem(null);
            refreshItems();
            resetForm();
        } catch (error) {
            console.error('Error saving item:', error);
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setImage(null);
    };

    return (
        <form onSubmit={handleSubmit} className="container my-4">
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                />
            </div>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                />
            </div>
            <div className="mb-3">
                <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setImage(e.target.files[0])}
                />
            </div>
            <button type="submit" className="btn btn-primary">{selectedItem ? 'Update Item' : 'Add Item'}</button>
        </form>
    );
};

export default ItemForm;
