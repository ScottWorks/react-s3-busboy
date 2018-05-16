# How To Use

1.  fork and clone this repo
2.  run `npm install`
3.  add a .env file to the repo's root directory, add to .gitignore if necessary
4.  add the following constants to the .env file:
    `SERVER_PORT=4000`
    `AWS_REGION=<add this later>`
    `AWS_BUCKET=<add this later>`
    `AWS_ACCESS_KEY=<add this later>`
    `AWS_SECRET_KEY=<add this later>`
5.  create an AWS S3 account
6.  select your username in the top-righthand corner of the AWS dashboard, navigate to "My Security Credentials" then select "Get Started with IAM Users" IAM in AWS, add a new user with "Programmic Access" checked off, choose the appropiate access privledges, then copy the Access key ID (`AWS_ACCESS_KEY`), and Secret access key (`AWS_SECRET_KEY`) to the .env file
7.  the `AWS_REGION` should match the region of the AWS bucket(i.e. us east ohio = us-east-2), the `AWS_BUCKET` should match the title of the bucket
8.  run `npm start`
9.  in the client load any file, image, video, etc then verify it is stored in S3
10. celebrate!

Note: If you plan on hosting with Digital Ocean or any server that uses Ngnix for reverse proxying it may be necessary to change the `client_max_body_size` as needed.

https://stackoverflow.com/questions/2056124/nginx-client-max-body-size-has-no-effect

# Under the Hood

In short, BusBoy is a parser that expects multipart and or form-data, on the client side I used the FormData constructor to properly format the files being sent.
