CREATE TABLE [dbo].[availability] (
    [id]        INT          IDENTITY (1, 1) NOT NULL,
    [date]      VARCHAR (30) NOT NULL,
    [time]      VARCHAR (30) NOT NULL,
    [serviceId] VARCHAR (10) NOT NULL,
    [status]    VARCHAR (30) NOT NULL
);

CREATE TABLE [dbo].[bookings] (
    [id]        INT           IDENTITY (1, 1) NOT NULL,
    [date]      VARCHAR (20)  NOT NULL,
    [service]   VARCHAR (20)  NOT NULL,
    [duration]  VARCHAR (20)  NOT NULL,
    [time]      VARCHAR (20)  NOT NULL,
    [slots]     VARCHAR (20)  NULL,
    [username]  VARCHAR (30)  NOT NULL,
    [pax]       VARCHAR (20)  NOT NULL,
    [gender]    VARCHAR (20)  NOT NULL,
    [phone]     VARCHAR (20)  NOT NULL,
    [email]     VARCHAR (30)  NOT NULL,
    [remark]    VARCHAR (100) NULL,
    [payment]   VARCHAR (30)  NULL,
    [status]    VARCHAR (20)  NOT NULL,
    [masseurId] VARCHAR (20)  NULL,
    [userId]    VARCHAR (20)  NOT NULL
);

CREATE TABLE [dbo].[cart] (
    [id]        INT          IDENTITY (1, 1) NOT NULL,
    [productId] VARCHAR (20) NOT NULL,
    [qty]       VARCHAR (20) NOT NULL,
    [price]     VARCHAR (20) NOT NULL,
    [userId]    VARCHAR (10) NOT NULL
);

CREATE TABLE [dbo].[commission] (
    [id]         INT          IDENTITY (1, 1) NOT NULL,
    [date]       VARCHAR (30) NOT NULL,
    [service]    VARCHAR (30) NOT NULL,
    [commission] VARCHAR (30) NOT NULL
);

CREATE TABLE [dbo].[orders] (
    [id]        INT           IDENTITY (1, 1) NOT NULL,
    [productId] VARCHAR (20)  NOT NULL,
    [receipt]   TEXT          NOT NULL,
    [quantity]  VARCHAR (10)  NOT NULL,
    [price]     VARCHAR (20)  NULL,
    [name]      VARCHAR (50)  NOT NULL,
    [phone]     INT           NOT NULL,
    [address]   VARCHAR (100) NOT NULL,
    [userId]    INT           NOT NULL,
    [status]    INT           NOT NULL
);

CREATE TABLE [dbo].[products] (
    [id]          INT          IDENTITY (1, 1) NOT NULL,
    [name]        VARCHAR (50) NOT NULL,
    [image]       VARCHAR (50) NOT NULL,
    [description] TEXT         NOT NULL,
    [price]       INT          NOT NULL
);

CREATE TABLE [dbo].[services] (
    [id]          INT          IDENTITY (1, 1) NOT NULL,
    [name]        VARCHAR (40) NOT NULL,
    [category]    VARCHAR (20) NOT NULL,
    [duration]    VARCHAR (50) NOT NULL,
    [description] TEXT         NOT NULL,
    [image]       TEXT         NOT NULL,
    [price]       INT          NOT NULL
);

CREATE TABLE [dbo].[users] (
    [id]       INT           IDENTITY (1, 1) NOT NULL,
    [username] VARCHAR (50)  NOT NULL,
    [password] VARCHAR (100) NOT NULL,
    [dob]      VARCHAR (40)  NOT NULL,
    [gender]   VARCHAR (10)  NOT NULL,
    [phone]    VARCHAR (15)  NOT NULL,
    [email]    VARCHAR (100) NOT NULL,
    [address]  VARCHAR (100) NOT NULL,
    [photo]    VARCHAR (100) NULL,
    [role]     INT           DEFAULT ((2)) NOT NULL,
    [empId]    VARCHAR (10)  NULL
);
