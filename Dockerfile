FROM microsoft/dotnet:1.0.0-preview2-sdk

#RUN curl -sL https://deb.nodesource.com/setup_5.x | bash - \
    #&& apt-get install -y nodejs

WORKDIR /code

ADD src/ /code
ADD app/dist /code

RUN dotnet restore && dotnet publish -c Release -o ./

EXPOSE 8083

CMD ["dotnet", "suaveapp.dll"]
