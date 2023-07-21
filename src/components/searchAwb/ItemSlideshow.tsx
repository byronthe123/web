import React, { useState } from 'react';
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    Card,
    CardBody
} from 'reactstrap';

type Props = {
    items: Array<any>,
    handleSelectItem: (item: any) => void,
    inline?: boolean
}

export default function ItemSlideshow ({
    items,
    handleSelectItem,
    inline
}: Props) {

    console.log(items);

    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
        handleSelectItem(items[nextIndex]);
        setActiveIndex(nextIndex);
    }

    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
        handleSelectItem(items[nextIndex]);
        setActiveIndex(nextIndex);
    }

    const goToIndex = (newIndex: number) => {
        if (animating) return;
        setActiveIndex(newIndex);
    }

    const slides = items && items.length > 0 && items.map((item, i) => {
        return (
                <CarouselItem
                    onExiting={() => setAnimating(true)}
                    onExited={() => setAnimating(false)}
                    key={i}
                >
                    <Card style={{borderRadius: '0.75rem', width: '100%'}} className='text-center mx-auto'>
                    <CardBody className='py-2 text-center mx-auto'>
                        {/* <h3 className='my-0 mx-auto' data-testid={'awb-slide'}>
                            test
                        </h3> */}
                    </CardBody>
                    </Card>
                    {/* <CarouselCaption captionText={item.caption} captionHeader={item.caption} /> */}
                </CarouselItem>
            );
    });

    return (
        items && items.length > 0 ?
            <div className={`px-0 py-0 ${inline && 'd-inline'}`} data-testid={'awb-slideshow'}>
                <style>
                    {
                    `
                        .carousel-control-prev-icon,
                        .carousel-control-next-icon {
                        filter: invert(100%);
                        }

                        .carousel-inner {
                        text-align: center;
                        }

                        .carousel-indicators {
                        display: none;
                        }
                    `
                    }
                </style>
                <Carousel
                    activeIndex={activeIndex}
                    next={next}
                    previous={previous}
                    interval={false}
                    keyboard={false}
                >
                    <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
                    {slides}
                    <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} data-testid={'btn-awb-previous'} />
                    <CarouselControl direction="next" directionText="Next" onClickHandler={next} data-testid={'btn-awb-next'} />
                </Carousel>
            </div> :
        <></>
    );
}
