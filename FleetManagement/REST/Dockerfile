FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ["REST/REST.csproj", "REST/"]
COPY ["Fleet_Management_BL/Fleet_Management_BL.csproj", "Fleet_Management_BL/"]
COPY ["Fleet_Management_DL/Fleet_Management_DL.csproj", "Fleet_Management_DL/"]
RUN dotnet restore "REST/REST.csproj"

# Copy everything else
COPY . .
WORKDIR "/src/REST"
RUN dotnet build "REST.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "REST.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Enable globalization support
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

EXPOSE 80
EXPOSE 443
ENTRYPOINT ["dotnet", "REST.dll"] 