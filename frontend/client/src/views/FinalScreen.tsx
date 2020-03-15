import React from 'react';
import { motion } from 'framer-motion';
import { H1, H3, Div } from '@haas/ui';

const FinalScreen = () => {
    const pageVariants = {
        initial: {
            y: '100%',
            opacity: 0,
        },
        in: {
            y: 0,
            opacity: 1,
        },
        out: {
            opacity: 0,
        }
    };

    return (
        <div>
            <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            >
                <Div color="white">
                    <H1 textAlign="center" color="white">Thank you for participating!</H1>

                    <H3 textAlign="center">We will get back to you</H3>
                </Div>
            </motion.div>
        </div>
    )
}

export default FinalScreen;
