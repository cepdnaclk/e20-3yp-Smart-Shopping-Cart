import React from 'react';
import Logo from '../../assets/smart_shopping_cart_logo-Photoroom.png';

const AuthBranding: React.FC = () => {
    const benefits = [
        "Optimize customer flow and navigation",
        "Reduce average shopping time by 30%",
        "Boost customer satisfaction scores",
        "Increase revenue through strategic placement"
    ];

    return (
        <div style={{
            flex: "1",
            backgroundColor: "#2a41e8",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            color: "white",
            boxShadow: "0px 0px 15px rgba(0,0,0,0.1)",
            minHeight: "100vh",
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "30px",
                flexWrap: "wrap",
                gap: "15px",
            }}>
                <div style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "transparent",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "36px",
                }}>
                    <img
                        src={Logo}
                        alt="Smart Shopping Cart Logo"
                        style={{
                            width: "100%",
                            height: "80px",
                            objectFit: "contain",
                            marginBottom: "6px",
                        }}
                    />
                </div>
                <span style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    color: "white",
                    textAlign: "center",
                }}>
                    Smart Shopping Cart
                </span>
            </div>

            <p style={{
                fontSize: "18px",
                marginBottom: "40px",
                textAlign: "center",
                lineHeight: "1.6",
                maxWidth: "400px",
            }}>
                Transform your retail experience with intelligent store layout optimization and enhanced customer navigation.
            </p>

            <div style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                padding: "30px",
                borderRadius: "12px",
                width: "100%",
                maxWidth: "400px",
            }}>
                <h3 style={{
                    fontSize: "20px",
                    marginBottom: "20px",
                    textAlign: "center",
                    fontWeight: "600",
                }}>
                    Key Benefits
                </h3>
                <ul style={{
                    listStyleType: "none",
                    padding: "0",
                    margin: "0",
                }}>
                    {benefits.map((benefit, index) => (
                        <li key={index} style={{
                            marginBottom: "15px",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "15px",
                        }}>
                            <span style={{
                                marginRight: "12px",
                                color: "#4cd964",
                                fontWeight: "bold",
                                fontSize: "18px",
                            }}>✓</span>
                            {benefit}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AuthBranding;