export const HAASSignIn = () => {
  return (
    <>
      <Flex>
        <label htmlFor="email">
          Email Address
          <input id="email" type="email"></input>
        </label>

        <Button onClick={() => console.log('clicked')}>Continue</Button>
      </Flex>
    </>
  );
}
