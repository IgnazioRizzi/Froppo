FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["Backend/src/Froppo.API/Froppo.API.csproj", "Backend/src/Froppo.API/"]
COPY ["Backend/src/Froppo.Application/Froppo.Application.csproj", "Backend/src/Froppo.Application/"]
COPY ["Backend/src/Froppo.Domain/Froppo.Domain.csproj", "Backend/src/Froppo.Domain/"]
COPY ["Backend/src/Froppo.Infrastructure/Froppo.Infrastructure.csproj", "Backend/src/Froppo.Infrastructure/"]

RUN dotnet restore "Backend/src/Froppo.API/Froppo.API.csproj"
COPY . .
WORKDIR "/src/Backend/src/Froppo.API"
RUN dotnet build "Froppo.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Froppo.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Froppo.API.dll"]
