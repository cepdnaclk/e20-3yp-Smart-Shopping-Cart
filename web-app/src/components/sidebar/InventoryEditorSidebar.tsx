import React, { useMemo } from "react";
import { useEditorContext } from "../../hooks/context/useEditorContext";
import { useItemContext } from "../../hooks/context/useItemContext";
import styles from "./InventoryEditorSidebar.module.css";

const InventoryEditorSidebar: React.FC = () => {
  const { toggleEditor } = useEditorContext();
  const { products, setFilteredProducts } = useItemContext();

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((product) => {
      if (product.productCategory) set.add(product.productCategory);
    });
    return Array.from(set);
  }, [products]);

  const handleFilter = (category: string | null) => {
    if (!category) {
      setFilteredProducts(products); // All
    } else {
      setFilteredProducts(products.filter(p => p.productCategory === category));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content + " scrollable-area"}>
        <button onClick={() => handleFilter(null)} className={styles.categoryButton}>
          All
        </button>
        {categories.map((category, index) => (
          <button
            key={index}
            className={styles.categoryButton}
            onClick={() => handleFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className={styles.footer}>
        <button
          className={styles.openLayoutButton}
          onClick={() => toggleEditor("layout")}
        >
          Open Layout Editor
        </button>
      </div>
    </div>
  );
};

export default InventoryEditorSidebar;
