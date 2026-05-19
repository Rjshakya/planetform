export const ThankyouMessage = (customMessage?: string) => ` 
<h2>
      Thankyou
      <p>${customMessage ? customMessage : "Your response is successfully submitted"}</p>
      <p>
        This form is created using  
        <a href="https://planetform.xyz">planetform.xyz</a>
      </p>
    </h2>`;
