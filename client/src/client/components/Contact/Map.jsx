const Map = () => {
    return (
        <section className="w-full my-5">
            <iframe
                className="w-full h-96 border-none"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243646.90509334358!2d78.24322983008491!3d17.412608644350257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1728716312679!5m2!1sen!2sin"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </section>
    );
};

export default Map;
