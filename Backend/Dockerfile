# Dockerfile per .NET 9.0
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["src/Froppo.API/Froppo.API.csproj", "src/Froppo.API/"]
COPY ["src/Froppo.Application/Froppo.Application.csproj", "src/Froppo.Application/"]
COPY ["src/Froppo.Domain/Froppo.Domain.csproj", "src/Froppo.Domain/"]
COPY ["src/Froppo.Infrastructure/Froppo.Infrastructure.csproj", "src/Froppo.Infrastructure/"]
RUN dotnet restore "src/Froppo.API/Froppo.API.csproj"
COPY . .
WORKDIR "/src/src/Froppo.API"
RUN dotnet build "Froppo.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Froppo.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Froppo.API.dll"]
